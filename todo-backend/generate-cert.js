const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

// Crear directorio certs si no existe
const certDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
}

// Generar par de claves
const keys = forge.pki.rsa.generateKeyPair(2048);
const privateKey = forge.pki.privateKeyToPem(keys.privateKey);

// Crear certificado
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
    name: 'commonName',
    value: 'localhost'
}, {
    name: 'countryName',
    value: 'BO'
}, {
    shortName: 'ST',
    value: 'State'
}, {
    name: 'localityName',
    value: 'City'
}, {
    name: 'organizationName',
    value: 'TodoApp'
}, {
    shortName: 'OU',
    value: 'Development'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
}, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
}, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true
}, {
    name: 'subjectAltName',
    altNames: [{
        type: 2,
        value: 'localhost'
    }, {
        type: 7,
        ip: '127.0.0.1'
    }]
}]);

cert.sign(keys.privateKey, forge.md.sha256.create());

const certPem = forge.pki.certificateToPem(cert);

// Guardar archivos
fs.writeFileSync(path.join(certDir, 'key.pem'), privateKey);
fs.writeFileSync(path.join(certDir, 'cert.pem'), certPem);

console.log('✅ Certificados generados en la carpeta certs/');
console.log('   - key.pem (clave privada)');
console.log('   - cert.pem (certificado)');