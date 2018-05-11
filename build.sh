echo "extart files start"
mkdir -p build
mkdir -p build/config
cp -r dist build
cp -r images build
cp config.js package.json service.js .babelrc build
cp config/application.js build/config
echo "extart files end"


echo "compress to zip start"
cd build
zip -rq ../TollGate.zip ./*
cd ..
echo "compress to zip end"

echo "remove build tmp file start"
# rm -rf ${deploy_root}/build
echo "remove build tmp file end"


