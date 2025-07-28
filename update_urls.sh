#!/bin/bash

# Update all .html references to clean URLs across all HTML files

# List of files to update
files=(
    "index.html" "latest.html" "kenya.html" "world.html" 
    "entertainment.html" "technology.html" "business.html" 
    "sports.html" "health.html" "lifestyle.html" "music.html" 
    "food.html" "showtime.html" "crypto.html" "astronomy.html" 
    "aviation.html" "weather.html" "live-tv.html"
)

echo "Updating URLs to remove .html extensions..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Update navigation links
        sed -i 's|href="index\.html"|href="/"|g' "$file"
        sed -i 's|href="latest\.html"|href="/latest"|g' "$file"
        sed -i 's|href="kenya\.html"|href="/kenya"|g' "$file"
        sed -i 's|href="world\.html"|href="/world"|g' "$file"
        sed -i 's|href="entertainment\.html"|href="/entertainment"|g' "$file"
        sed -i 's|href="technology\.html"|href="/technology"|g' "$file"
        sed -i 's|href="business\.html"|href="/business"|g' "$file"
        sed -i 's|href="sports\.html"|href="/sports"|g' "$file"
        sed -i 's|href="health\.html"|href="/health"|g' "$file"
        sed -i 's|href="lifestyle\.html"|href="/lifestyle"|g' "$file"
        sed -i 's|href="music\.html"|href="/music"|g' "$file"
        sed -i 's|href="food\.html"|href="/food"|g' "$file"
        sed -i 's|href="showtime\.html"|href="/showtime"|g' "$file"
        sed -i 's|href="crypto\.html"|href="/crypto"|g' "$file"
        sed -i 's|href="astronomy\.html"|href="/astronomy"|g' "$file"
        sed -i 's|href="aviation\.html"|href="/aviation"|g' "$file"
        sed -i 's|href="weather\.html"|href="/weather"|g' "$file"
        sed -i 's|href="live-tv\.html"|href="/live-tv"|g' "$file"
        
        # Update meta og:url properties
        sed -i 's|philipkilonzoke\.github\.io/index\.html|philipkilonzoke.github.io/|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/latest\.html|philipkilonzoke.github.io/latest|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/kenya\.html|philipkilonzoke.github.io/kenya|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/world\.html|philipkilonzoke.github.io/world|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/entertainment\.html|philipkilonzoke.github.io/entertainment|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/technology\.html|philipkilonzoke.github.io/technology|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/business\.html|philipkilonzoke.github.io/business|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/sports\.html|philipkilonzoke.github.io/sports|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/health\.html|philipkilonzoke.github.io/health|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/lifestyle\.html|philipkilonzoke.github.io/lifestyle|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/music\.html|philipkilonzoke.github.io/music|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/food\.html|philipkilonzoke.github.io/food|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/showtime\.html|philipkilonzoke.github.io/showtime|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/crypto\.html|philipkilonzoke.github.io/crypto|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/astronomy\.html|philipkilonzoke.github.io/astronomy|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/aviation\.html|philipkilonzoke.github.io/aviation|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/weather\.html|philipkilonzoke.github.io/weather|g' "$file"
        sed -i 's|philipkilonzoke\.github\.io/live-tv\.html|philipkilonzoke.github.io/live-tv|g' "$file"
        
    else
        echo "File $file not found, skipping..."
    fi
done

echo "URL updates completed!"