import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {Simulate} from 'react-dom/test-utils';
import App from './App';
global.IS_REACT_ACT_ENVIRONMENT=true;
let container,root;
beforeEach(()=>{localStorage.clear();window.scrollTo=jest.fn();window.history.replaceState({},'', '/quotation?origin=Lisboa&destination=Porto');container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);act(()=>root.render(<App/>));});
afterEach(()=>{act(()=>root.unmount());container.remove();});
const fill=(name,value)=>{const field=container.querySelector(`[name="${name}"]`);act(()=>Simulate.change(field,{target:{value}}));};
const submit=()=>act(()=>container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
test('route from the homepage survives the three-step demo enquiry and editing',()=>{
 expect(container.querySelector('[name="origin"]').value).toBe('Lisboa');expect(container.querySelector('[name="destination"]').value).toBe('Porto');
 fill('date','2026-11-01');submit();fill('kind','Boxes');fill('weight','25');fill('description','3 boxes, 40 x 40 cm');submit();fill('name','Demo User');fill('email','demo@example.com');submit();
 expect(container.querySelector('[role="status"]').textContent).toContain('Nenhum pedido foi enviado');
 expect(container.querySelector('[role="status"]').textContent).toContain('Lisboa');
 act(()=>[...container.querySelectorAll('button')].find(b=>b.textContent==='Preparar outro pedido').click());
 expect(container.querySelector('[name="origin"]').value).toBe('Lisboa');
});
test('language switching translates the quote form and document',()=>{act(()=>{const select=container.querySelector('select');select.value='en';select.dispatchEvent(new Event('change',{bubbles:true}));});expect(container.querySelector('h1').textContent).toBe('Plan a shipment');expect(document.documentElement.lang).toBe('en');expect(container.textContent).toContain('The cargo');});
