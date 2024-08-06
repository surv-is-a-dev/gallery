node build/index.js development # Build the files.xml
cd ./site # Go to the site directory
sudo python3 -m http.server 9000 --bind localhost # Serve the site
