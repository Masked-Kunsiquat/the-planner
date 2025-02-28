import csv
import json
import os

# Default file paths
DAT_FILE = "airlines.dat"
DEFAULT_JSON_NAME = "airlines.json"
LOG_DIR = os.getcwd()  # Use the current working directory

def get_log_filename():
    """Generates a unique log filename to avoid overwriting previous logs."""
    base_name = "ALine_run"
    ext = ".txt"
    
    counter = 1
    while os.path.exists(os.path.join(LOG_DIR, f"{base_name}_{counter}{ext}")):
        counter += 1
    
    return os.path.join(LOG_DIR, f"{base_name}_{counter}{ext}")

def parse_airlines(dat_file, json_file, log_file):
    """Converts an airline .dat file to JSON, renaming 'id' to 'ident' and handling null values."""
    data = []

    with open(log_file, "w", encoding="utf-8") as log:
        def log_print(message):
            """Prints to console and writes to log file."""
            print(message)
            log.write(message + "\n")

        try:
            with open(dat_file, mode="r", encoding="utf-8") as file:
                reader = csv.reader(file)  # .dat is similar to CSV
                
                for row in reader:
                    try:
                        airline = {
                            "ident": int(row[0]),  # Renamed 'id' to 'ident'
                            "name": row[1] if row[1] != r"\N" else None,
                            "alias": row[2] if row[2] != r"\N" else None,
                            "iata_code": row[3] if row[3] != r"\N" else None,
                            "icao_code": row[4] if row[4] != r"\N" else None,
                            "callsign": row[5] if row[5] != r"\N" else None,
                            "country": row[6] if row[6] != r"\N" else None,
                            "active": True if row[7] == "Y" else False
                        }
                        data.append(airline)
                        log_print(f"Processed Airline: {airline['name']} ✅")

                    except Exception as e:
                        log_print(f"⚠️ ERROR processing row {row}: {e}")

            # Write to JSON
            with open(json_file, mode="w", encoding="utf-8") as file:
                json.dump(data, file, indent=2)

            log_print(f"\n✅ Converted {dat_file} → {json_file} successfully!\n")
        
        except FileNotFoundError:
            log_print(f"❌ ERROR: File '{dat_file}' not found.")
        except Exception as e:
            log_print(f"❌ ERROR: An unexpected error occurred - {e}")

if __name__ == "__main__":
    # Request input paths from user
    default_dir = os.getcwd()
    dat_path = input(f"Enter the path to the .dat file [{DAT_FILE}]: ").strip() or DAT_FILE
    json_path = input(f"Enter the output JSON file or directory [{DEFAULT_JSON_NAME}]: ").strip() or DEFAULT_JSON_NAME

    # If the user provides a directory, use the default file name inside that directory
    if os.path.isdir(json_path):
        json_path = os.path.join(json_path, DEFAULT_JSON_NAME)

    # Generate log filename
    log_filename = get_log_filename()

    # Run conversion
    parse_airlines(dat_path, json_path, log_filename)

    print(f"\nLog saved to {log_filename}")
