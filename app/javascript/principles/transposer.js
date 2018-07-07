Array.prototype.rotateRight = function( n ) {
  this.unshift.apply(this, this.splice( n, this.length ));
  return this;
};

const DIATONICS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const CHROMATICS = {
  'C': 0,
  'B#': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'Eb': 3,
  'D#': 3,
  'E': 4,
  'Fb': 4,
  'F': 5,
  'E#': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'Bb': 10,
  'A#': 10,
  'B': 11,
  'Cb': 11
};

const SIGNATURE = {
  'Fb': -8,
  'Cb': -7,
  'Gb': -6,
  'Db': -5,
  'Ab': -4,
  'Eb': -3,
  'Bb': -2,
  'F': -1,
  'C': 0,
  'G': 1,
  'D': 2,
  'A': 3,
  'E': 4,
  'B': 5,
  'F#': 6,
  'C#': 7,
  'G#': 8,
  'D#': 9,
  'A#': 10,
  'E#': 11,
  'B#': 12
};

const SHARPS = [0, 1, 2, 3, 4, 5, 6].map(i => (6 + i*3) % 7);
const FLATS  = [0, 1, 2, 3, 4, 5, 6].map(i => (3 + i*4) % 7);

// Transpose any note by the same amount as a given root key to a new key.
// It chooses notes that fit the key signature of the new root. For example:
//
//   transpose({ from: 'C', to: 'G', note: 'B' })
//     => 'F#' (B was 7th note in C scale, F# is 7th note in G scale)
//
//   transpose({ from: 'F', to: 'F#', note: 'D' })
//     => 'D#'
//
//   transpose({ from: 'F', to: 'Gb', note: 'D' })
//     => 'Eb' # same note as above but in key signature of Gb
//
export function transpose({ from, to, note }) {
  const noteC = chromaticIndex(note);
  const fromC = chromaticIndex(from);
  const toC = chromaticIndex(to);
  const diffC = (toC - fromC + 12) % 12;

  const noteD = diatonicIndex(note);
  const fromD = diatonicIndex(from);
  const toD = diatonicIndex(to);
  const diffD = (toD - fromD + 7) % 7;

  const finalC = (noteC + diffC + 12) % 12;
  const finalD = (noteD + diffD + 7) % 7;
  return chromaticAt(finalC, diatonicAt(finalD)) || chromaticAt(finalC);
}

// 0 => C, 1 => C#, ..
function chromaticAt(index, key) {
  return Object.keys(CHROMATICS).find(k =>
    CHROMATICS[k] === index && (!key || k.slice(0, key.length) === key)
  );
}

// C => 0, C# => 1, ..
function chromaticIndex(note) {
  return CHROMATICS[note.match(/^[A-G][#b]?/)[0]];
}

// 0 => C, 1 => D, 2 => E, ..
function diatonicAt(index) {
  return DIATONICS[index];
}

// C => 0, D => 1, E => 2, ..
function diatonicIndex(key) {
  return DIATONICS.indexOf(key[0]);
}

export function scaleOf(key) {
  const minor = /m$/.test(key);
  key = key.replace(/m$/, '');

  const diatonics = DIATONICS.slice(0).rotateRight(diatonicIndex(key));

  let signature = SIGNATURE[key];
  if (minor) {
    signature -= 3;
  }

  let sharps = SHARPS.slice(0, Math.abs(signature));
  let flats = FLATS.slice(0, Math.abs(signature));

  if (minor) {
    sharps = sharps.map(flat => (flat + 2) % 7);
    flats = flats.map(flat => (flat + 2) % 7);
  }

  if (signature === 0) {
    return diatonics;
  } else if (signature > 0) {
    return diatonics.map((note, index) =>
      sharps.indexOf(index) > -1 ? `${note}#` : note
    );
  } else {
    return diatonics.map((note, index) =>
      flats.indexOf(index) > -1 ? `${note}b` : note
    );
  }
}

export function chordsOf(key) {
  const scale = scaleOf(key);
  if (key[key.length - 1] === 'm') {
    return [`${scale[0]}m`, scale[2], `${scale[3]}m`, `${scale[4]}m`, scale[5], scale[6]];
  } else {
    return [scale[0], `${scale[1]}m`, `${scale[2]}m`, scale[3], scale[4], `${scale[5]}m`];
  }
}
