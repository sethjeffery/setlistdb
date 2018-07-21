module Regexes

  CHORD_REGEX = /[A-G](?:[b#])?(?:m|M|maj|MAJ|mM)?(?:[0-9]{0,2})(?:[b#+-][0-9])?(?:\/[A-G](?:[b#])?)?/

  CHORDPRO_REGEX = /\[(#{CHORD_REGEX})\]/

  CHORDSIMPLE_REGEX = /^\s*\[?(#{CHORD_REGEX})\]?(?:\s+\[?(#{CHORD_REGEX})\]?)*\s*$/m

  TITLE_REGEX = /^:*(?:\d(st|nd|rd|th)\s)?(?:V|VERSE|CHORUS|PRE|PRE-?CHORUS|BRIDGE|CODA|INTRO|OUTRO|TAG|ENDING|END)\s*\d*:*$/i

end
