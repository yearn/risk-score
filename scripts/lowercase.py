import os
from pathlib import Path

def rename_to_lowercase(directory):
    # Convert to Path object for better path handling
    base_dir = Path(directory)

    # Walk through all directories and files
    for root, dirs, files in os.walk(base_dir):
        # Convert current root to Path object
        root_path = Path(root)

        # Handle files first
        for filename in files:
            if not filename.endswith(".json"):
                print(f"Skipped (not a json file): {filename}")
                continue
            old_path = root_path / filename
            new_filename = filename.lower()
            new_path = root_path / new_filename

            # Only rename if the name would actually change
            if str(old_path) != str(new_path):
                try:
                    old_path.rename(new_path)
                    print(f"Renamed: {old_path} -> {new_path}")
                except Exception as e:
                    print(f"Error renaming {old_path}: {e}")


if __name__ == "__main__":
    vaults_dir = "../risk-score/vaults/1"
    print(f"Starting to rename files in {vaults_dir} to lowercase...")
    rename_to_lowercase(vaults_dir)
    print("Done!")
