import os
import glob
import xml.etree.ElementTree as ET

namespaces = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main", "p": "http://schemas.openxmlformats.org/presentationml/2006/main"}
ppt_dir = "./tmp_pptx"
slide_files = glob.glob(os.path.join(ppt_dir, "ppt", "slides", "slide*.xml"))

def sort_key(f):
    name = os.path.basename(f)
    try:
        return int(name.replace("slide", "").replace(".xml", ""))
    except ValueError:
        return 0

slide_files.sort(key=sort_key)

with open("company_profile.txt", "w", encoding="utf-8") as f_out:
    for slide in slide_files:
        try:
            tree = ET.parse(slide)
            root = tree.getroot()
            texts = []
            for node in root.findall(".//a:t", namespaces):
                if node.text:
                    texts.append(node.text)
            if texts:
                f_out.write(f"--- {os.path.basename(slide)} ---\n")
                f_out.write("\n".join(texts) + "\n\n")
        except Exception as e:
            print(f"Error on {slide}: {e}")
print("Extraction complete.")
