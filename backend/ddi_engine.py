import json
import os
from typing import List, Dict, Any, Set

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
BRAND_SALTS_FILE = os.path.join(DATA_DIR, "brand_salts.json")
DDI_MATRIX_FILE = os.path.join(DATA_DIR, "ddi_matrix.json")

def load_brand_salts() -> Dict[str, List[str]]:
    try:
        with open(BRAND_SALTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def load_ddi_matrix() -> List[Dict[str, Any]]:
    try:
        with open(DDI_MATRIX_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

BRAND_MAP = load_brand_salts()
DDI_RULES = load_ddi_matrix()

def normalize_salt_name(salt: str) -> str:
    s = salt.lower().strip()
    # Canonical replacements
    if "aspirin" in s or "acetylsalicylic" in s:
        return "aspirin"
    if "ibuprofen" in s:
        return "ibuprofen"
    if "paracetamol" in s or "acetaminophen" in s:
        return "paracetamol"
    if "pantoprazole" in s:
        return "pantoprazole"
    if "domperidone" in s:
        return "domperidone"
    if "amoxicillin" in s or "amoxycillin" in s:
        return "amoxicillin"
    if "clavulan" in s:
        return "clavulanic acid"
    if "diclofenac" in s:
        return "diclofenac"
    if "aceclofenac" in s:
        return "aceclofenac"
    if "metformin" in s:
        return "metformin"
    if "telmisartan" in s:
        return "telmisartan"
    if "clopidogrel" in s:
        return "clopidogrel"
    return s

def resolve_salts(brand_name: str, given_salts: List[str] = None) -> List[str]:
    """
    Normalizes commercial brand trade names directly to an Array of active salts.
    Handles multi-salt combination pills like Pan-D -> ['pantoprazole', 'domperidone'].
    """
    salts_found: List[str] = []
    
    # 1. Direct dictionary match
    for brand, salts_list in BRAND_MAP.items():
        if brand.lower() in brand_name.lower() or brand_name.lower() in brand.lower():
            salts_found.extend(salts_list)
            break
            
    # 2. If given_salts array provided from LLM extraction
    if not salts_found and given_salts:
        salts_found = given_salts

    # Standardize & deduplicate
    normalized = [normalize_salt_name(s) for s in salts_found]
    return list(dict.fromkeys(normalized))

def evaluate_ddi_conflicts(
    new_medicines: List[Dict[str, Any]], 
    existing_medications: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Cross-checks all active molecules across new and pre-existing patient prescriptions.
    Deterministic rule engine matching against DDI matrix.
    """
    if existing_medications is None:
        existing_medications = []

    # Map of salt -> List of medication dicts containing this salt
    salt_to_meds: Dict[str, List[Dict[str, Any]]] = {}

    all_meds = new_medicines + existing_medications

    for med in all_meds:
        brand = med.get("brand_name", "")
        raw_salts = med.get("active_salts", [])
        resolved = resolve_salts(brand, raw_salts)
        med["resolved_salts"] = resolved
        
        for salt in resolved:
            if salt not in salt_to_meds:
                salt_to_meds[salt] = []
            salt_to_meds[salt].append(med)

    active_salts_list = list(salt_to_meds.keys())
    conflicts_detected: List[Dict[str, Any]] = []

    # Evaluate against DDI matrix
    for rule in DDI_RULES:
        rule_salts = [normalize_salt_name(s) for s in rule["salts"]]
        
        # Check if ALL salts in this interaction pair exist in patient's active therapy
        if all(s in salt_to_meds for s in rule_salts):
            conflicting_med_brands = []
            for s in rule_salts:
                for med in salt_to_meds[s]:
                    brand_name = med.get("brand_name", "Unknown")
                    if brand_name not in conflicting_med_brands:
                        conflicting_med_brands.append(brand_name)

            conflicts_detected.append({
                "severity": rule.get("severity", "HIGH_RISK"),
                "title": rule.get("title", "Drug-Drug Conflict"),
                "description": rule.get("description", ""),
                "recommendation": rule.get("recommendation", ""),
                "conflicting_salts": rule_salts,
                "conflicting_brands": conflicting_med_brands
            })

    has_high_risk = any(c["severity"] == "HIGH_RISK" for c in conflicts_detected)
    has_moderate_risk = any(c["severity"] == "MODERATE_RISK" for c in conflicts_detected)

    overall_status = "SAFE"
    if has_high_risk:
        overall_status = "HIGH_RISK"
    elif has_moderate_risk:
        overall_status = "MODERATE_RISK"

    return {
        "status": overall_status,
        "conflict_count": len(conflicts_detected),
        "active_salts_evaluated": active_salts_list,
        "conflicts": conflicts_detected
    }
