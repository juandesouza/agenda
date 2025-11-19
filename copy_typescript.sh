#!/bin/bash
# Copy TypeScript from another project
SOURCE="/home/juan/Projects/ai_vet_clinic_lp/node_modules/typescript"
DEST="/home/juan/Projects/agenda/node_modules/typescript"

if [ -d "$SOURCE" ]; then
    echo "Copying TypeScript from $SOURCE to $DEST..."
    rm -rf "$DEST"
    cp -r "$SOURCE" "$DEST"
    
    if [ -f "$DEST/package.json" ]; then
        echo "✅ TypeScript copied successfully!"
        echo "Version: $(grep '"version"' "$DEST/package.json" | head -1)"
    else
        echo "❌ Copy failed - package.json not found"
        exit 1
    fi
else
    echo "❌ Source directory not found: $SOURCE"
    exit 1
fi

