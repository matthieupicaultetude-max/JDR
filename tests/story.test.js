import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,resolve,setChoice} from '../engine.js';
import {characters,scene,personalOutcome,outcomeText,actionText} from '../story.js';

test('Chaque personnage possède un rôle, un objectif et une scène pour chaque jour',()=>{
  assert.equal(characters.length,5);
  for(let i=0;i<5;i++){
    assert.ok(characters[i].role&&characters[i].bio&&characters[i].objective&&characters[i].secret);
    for(let day=0;day<3;day++)assert.ok(scene({...fresh(),day},i).length>150);
    for(const a of ['rest','effort','heal','shield','scan'])assert.ok(actionText(i,a));
  }
  for(const day of outcomeText)for(const problem of day)assert.equal(problem.length,2);
});
test('La narration du lendemain reflète le réacteur et la balise',()=>{
  const s=fresh();s.day=1;
  assert.match(scene(s,0),/qu’une nouvelle cartouche/);
  s.reactor=true;assert.match(scene(s,0),/deux nouvelles cartouches/);
  s.day=2;assert.match(scene(s,0),/six cartouches/);
  s.beacon=true;assert.match(scene(s,0),/quatre cartouches/);
});
test('Le journal personnel garde l’état historique plutôt que les réserves actuelles',()=>{
  const s=fresh();setChoice(s,0,[0,0],'effort');const report=resolve(s);
  assert.equal(report.personal[0].hp,1);
  assert.equal(report.personal[0].energy,3);
  const text=personalOutcome(s,0,report);
  assert.match(text,/2 cartouche/);
  s.players[0].hp=3;s.players[0].energy=50;
  assert.equal(personalOutcome(s,0,report),text);
  assert.match(text,/1\/3 en santé, 3 cartouche/);
});
