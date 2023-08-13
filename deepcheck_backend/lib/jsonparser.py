import os
import json
import logging

def getJsonValue(key, filename='settings.json'):
    jsonfile = os.path.join("", filename)
    with open(jsonfile, 'r') as f:
        values = json.loads(f.read())
    try:
        return values[key]
    except KeyError:
        error_msg = "Set the {} environment variable".format(key)
        raise KeyError(error_msg)

if __name__ == "__main__":
    print()