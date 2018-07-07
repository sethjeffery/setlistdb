import { scaleOf, chordsOf, transpose } from 'principles/transposer';

test('scaleOf', () => {
  expect(scaleOf('C')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  expect(scaleOf('A')).toEqual(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
  expect(scaleOf('Cm')).toEqual(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']);
  expect(scaleOf('F#m')).toEqual(['F#', 'G#', 'A', 'B', 'C#', 'D', 'E']);
});

test('transpose', () => {
  expect(transpose({ from: 'C', to: 'G', note: 'C' })).toEqual('G');
  expect(transpose({ from: 'C', to: 'G', note: 'B' })).toEqual('F#');
  expect(transpose({ from: 'F', to: 'F#', note: 'D' })).toEqual('D#');
  expect(transpose({ from: 'F', to: 'Gb', note: 'D' })).toEqual('Eb');
  expect(transpose({ from: 'Bb', to: 'D', note: 'A#' })).toEqual('D');
});

test('chordsOf', () => {
  expect(chordsOf('C')).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am']);
  expect(chordsOf('B')).toEqual(['B', 'C#m', 'D#m', 'E', 'F#', 'G#m']);
  expect(chordsOf('Fm')).toEqual(['Fm', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb']);
  expect(chordsOf('Em')).toEqual(['Em', 'G', 'Am', 'Bm', 'C', 'D']);
});
