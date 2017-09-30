

bootstrap: ./libs/jquery/jquery-3.2.1.min.js ./libs/bootstrap/js/bootstrap.min.js


./libs/jquery/jquery-3.2.1.min.js:
	mkdir -p ./libs/jquery
	cd libs/jquery && wget -c https://code.jquery.com/jquery-3.2.1.min.js


./libs/bootstrap/js/bootstrap.min.js: ./libs/bootstrap-3.3.7-dist/js/bootstrap.min.js
	cd libs && ln -fs bootstrap-3.3.7-dist bootstrap

./libs/bootstrap-3.3.7-dist/js/bootstrap.min.js: ./libs/bootstrap-3.3.7-dist.zip
	cd libs && unzip -o bootstrap-3.3.7-dist.zip

./libs/bootstrap-3.3.7-dist.zip:
	cd libs && wget -c \
	https://github.com/twbs/bootstrap/releases/download/v3.3.7/bootstrap-3.3.7-dist.zip

#./libs/bootstrap/js/bootstrap.min.js: ./libs/bootstrap-4.0.0-alpha.6-dist/js/bootstrap.min.js
#	cd libs && ln -fs bootstrap-4.0.0-alpha.6-dist bootstrap

#./libs/bootstrap-4.0.0-alpha.6-dist/js/bootstrap.min.js: ./libs/bootstrap-4.0.0-alpha.6-dist.zip
#	cd libs && unzip -o bootstrap-4.0.0-alpha.6-dist.zip

#./libs/bootstrap-4.0.0-alpha.6-dist.zip:
#	cd libs && wget -c \
#	https://github.com/twbs/bootstrap/releases/download/v4.0.0-alpha.6/bootstrap-4.0.0-alpha.6-dist.zip


