import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List

def generate_fhir_r4_bundle(
    prescription_data: Dict[str, Any],
    lab_data: Dict[str, Any] = None,
    patient_id: str = None
) -> Dict[str, Any]:
    """
    Transforms extracted prescription & lab report data into an official HL7 FHIR R4 Bundle.
    Compliant with Ayushman Bharat Digital Mission (ABDM) OPConsultation & Prescription schemas.
    """
    bundle_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc).isoformat()
    
    patient_name = prescription_data.get("patient_name") or "Patient"
    doctor_name = prescription_data.get("doctor_name") or "Attending Physician"

    entries: List[Dict[str, Any]] = []

    # 1. Patient Resource
    patient_resource_id = f"Patient-{uuid.uuid4().hex[:8]}"
    patient_identifiers = []
    if patient_id:
        patient_identifiers.append({
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MR",
                        "display": "Medical Record Number"
                    }
                ]
            },
            "system": "https://healthid.ndhm.gov.in",
            "value": patient_id
        })

    patient_entry = {
        "fullUrl": f"urn:uuid:{patient_resource_id}",
        "resource": {
            "resourceType": "Patient",
            "id": patient_resource_id,
            "meta": {
                "profile": [
                    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"
                ]
            },
            "identifier": patient_identifiers,
            "name": [
                {
                    "text": patient_name
                }
            ]
        }
    }
    entries.append(patient_entry)

    # 2. Practitioner Resource
    practitioner_resource_id = f"Practitioner-{uuid.uuid4().hex[:8]}"
    practitioner_entry = {
        "fullUrl": f"urn:uuid:{practitioner_resource_id}",
        "resource": {
            "resourceType": "Practitioner",
            "id": practitioner_resource_id,
            "name": [
                {
                    "text": doctor_name
                }
            ]
        }
    }
    entries.append(practitioner_entry)

    # 3. MedicationRequest Resources
    for med in prescription_data.get("medicines", []):
        med_id = f"MedicationRequest-{uuid.uuid4().hex[:8]}"
        brand = med.get("brand_name", "Unknown Medicine")
        frequency = med.get("frequency", "")
        dosage = med.get("dosage", "")
        timing = med.get("timing", "")
        salts = med.get("active_salts", [])

        med_entry = {
            "fullUrl": f"urn:uuid:{med_id}",
            "resource": {
                "resourceType": "MedicationRequest",
                "id": med_id,
                "meta": {
                    "profile": [
                        "https://nrces.in/ndhm/fhir/r4/StructureDefinition/MedicationRequest"
                    ]
                },
                "status": "active",
                "intent": "order",
                "medicationCodeableConcept": {
                    "text": f"{brand} ({', '.join(salts)})",
                    "coding": [
                        {
                            "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                            "display": brand
                        }
                    ]
                },
                "subject": {
                    "reference": f"Patient/{patient_resource_id}",
                    "display": patient_name
                },
                "requester": {
                    "reference": f"Practitioner/{practitioner_resource_id}",
                    "display": doctor_name
                },
                "dosageInstruction": [
                    {
                        "text": f"{dosage} {frequency} ({timing})",
                        "timing": {
                            "code": {
                                "text": frequency
                            }
                        }
                    }
                ]
            }
        }
        entries.append(med_entry)

    # 4. DiagnosticReport Resource (If lab telemetry present)
    if lab_data and lab_data.get("metrics"):
        report_id = f"DiagnosticReport-{uuid.uuid4().hex[:8]}"
        obs_references = []

        for metric in lab_data.get("metrics", []):
            obs_id = f"Observation-{uuid.uuid4().hex[:8]}"
            obs_references.append({"reference": f"Observation/{obs_id}"})
            
            entries.append({
                "fullUrl": f"urn:uuid:{obs_id}",
                "resource": {
                    "resourceType": "Observation",
                    "id": obs_id,
                    "status": "final",
                    "code": {
                        "text": metric.get("test_name", "Lab Metric")
                    },
                    "subject": {
                        "reference": f"Patient/{patient_resource_id}"
                    },
                    "valueQuantity": {
                        "value": metric.get("value"),
                        "unit": metric.get("unit")
                    },
                    "referenceRange": [
                        {
                            "low": {"value": metric.get("min_ref")},
                            "high": {"value": metric.get("max_ref")}
                        }
                    ]
                }
            })

        report_entry = {
            "fullUrl": f"urn:uuid:{report_id}",
            "resource": {
                "resourceType": "DiagnosticReport",
                "id": report_id,
                "status": "final",
                "code": {
                    "text": lab_data.get("report_title", "Diagnostic Lab Report")
                },
                "subject": {
                    "reference": f"Patient/{patient_resource_id}"
                },
                "result": obs_references
            }
        }
        entries.append(report_entry)

    fhir_bundle = {
        "resourceType": "Bundle",
        "id": bundle_id,
        "meta": {
            "versionId": "1",
            "lastUpdated": timestamp,
            "profile": [
                "https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"
            ]
        },
        "type": "document",
        "timestamp": timestamp,
        "entry": entries
    }

    return fhir_bundle
