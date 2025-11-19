#!/usr/bin/env python3
import shutil
import sys
import os

source = '/home/juan/Projects/ai_vet_clinic_lp/node_modules/typescript'
dest = '/home/juan/Projects/agenda/node_modules/typescript'

try:
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(source, dest)
    print(f"✅ Successfully copied TypeScript from {source} to {dest}")
    sys.exit(0)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

