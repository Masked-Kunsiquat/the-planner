import csv
import json
import os
from collections import defaultdict

def get_absolute_path(prompt, default=None):
    """Prompts for a file/directory path, defaulting to the given value if empty."""
    path = input(f"{prompt} [{default}]: ").strip() or default
    return os.path.abspath(path) if path else None

def get_log_filename(output_dir):
    """Generates a unique log filename in the specified output directory."""
    base_name = "AC-run"
    ext = ".txt"
    
    # Find the next available number
    counter = 1
    while os.path.exists(os.path.join(output_dir, f"{base_name}_{counter}{ext}")):
        counter += 1
    
    return os.path.join(output_dir, f"{base_name}_{counter}{ext}")

def csv_to_json(csv_file, output_dir, log_file):
    """Converts a CSV file to a JSON file, extracting latitude and longitude from coordinates."""
    json_file = os.path.join(output_dir, "airports.json")
    data = []
    type_counts = defaultdict(int)  # Dictionary to count airport types

    with open(log_file, "w", encoding="utf-8") as log:
        def log_print(message):
            """Prints to console and writes to log file."""
            print(message)
            log.write(message + "\n")

        try:
            with open(csv_file, mode="r", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    try:
                        # Ensure name exists, otherwise set to None (NULL)
                        airport_name = row.get("name") or None
                        airport_type = row.get("type") or None
                        log_print(f"Converting Airport: {airport_name}... ")

                        # Track type counts
                        if airport_type:
                            type_counts[airport_type] += 1

                        # Extract and split coordinates
                        coordinates = row.pop("coordinates", "").strip()
                        if coordinates:
                            try:
                                lat, lon = map(float, coordinates.split(", "))
                                row["latitude"] = lat
                                row["longitude"] = lon
                            except ValueError:
                                log_print("  ERROR: Invalid coordinates format!")
                                row["latitude"] = None
                                row["longitude"] = None
                        else:
                            row["latitude"] = None
                            row["longitude"] = None

                        # Ensure empty fields are set to None and strip only strings
                        for key, value in row.items():
                            if key == "elevation_ft":  # Convert elevation to integer or None
                                try:
                                    row[key] = int(value) if value.strip() else None
                                except ValueError:
                                    row[key] = None
                            elif isinstance(value, str):  
                                row[key] = value.strip() or None
                            elif value == "":  
                                row[key] = None

                        data.append(row)
                        log_print("  DONE")

                    except Exception as e:
                        log_print(f"  ERROR processing {airport_name}: {e}")

            # Write to JSON
            with open(json_file, mode="w", encoding="utf-8") as file:
                json.dump(data, file, indent=2)

            log_print(f"\nConverted {csv_file} → {json_file} successfully!\n")

            # Display summary of airport types
            log_print("Airport Type Summary:")
            log_print("-" * 40)
            log_print(f"{'Type':<20} {'Count':>10}")
            log_print("-" * 40)
            for airport_type, count in sorted(type_counts.items()):
                log_print(f"{airport_type:<20} {count:>10}")
            log_print("-" * 40)

        except FileNotFoundError:
            log_print(f"ERROR: CSV file '{csv_file}' not found.")
        except Exception as e:
            log_print(f"ERROR: An unexpected error occurred - {e}")

if __name__ == "__main__":
    # Request input paths from user
    default_dir = os.getcwd()
    csv_path = get_absolute_path("Enter the path to the CSV file", default=os.path.join(default_dir, "airports.csv"))
    output_dir = get_absolute_path("Enter the output directory", default=default_dir)

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Generate log filename
    log_filename = get_log_filename(output_dir)

    # Run conversion
    csv_to_json(csv_path, output_dir, log_filename)

    print(f"\nLog saved to {log_filename}")
