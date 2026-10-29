# The shared static site (built by ./build-site.sh into _site/), served by nginx.
FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY _site /usr/share/nginx/html
