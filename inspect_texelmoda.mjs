import { Client } from '@gradio/client';

console.log('Connecting to texelmoda/virtual-try-on-diffusion-vton-d...');
const app = await Client.connect('texelmoda/virtual-try-on-diffusion-vton-d');
const info = await app.view_api();
console.log('Endpoints:');
for (const [name, ep] of Object.entries(info.named_endpoints || {})) {
  console.log(name, ep.parameters?.map(p => ({ name: p.parameter_name, label: p.label })));
}
console.log('Unnamed endpoints count:', info.unnamed_endpoints?.length);
if (info.unnamed_endpoints?.length > 0) {
  for (let i = 0; i < info.unnamed_endpoints.length; i++) {
    console.log(`Unnamed [${i}]:`, info.unnamed_endpoints[i].parameters?.map(p => ({ name: p.parameter_name, label: p.label })));
  }
}
