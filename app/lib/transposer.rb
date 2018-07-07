module Transposer
  extend self

  DIATONICS = %w[C D E F G A B]
  CHROMATICS = {
    'C' => 0,
    'B#' => 0,
    'C#' => 1,
    'Db' => 1,
    'D' => 2,
    'Eb' => 3,
    'D#' => 3,
    'E' => 4,
    'Fb' => 4,
    'F' => 5,
    'E#' => 5,
    'F#' => 6,
    'Gb' => 6,
    'G' => 7,
    'G#' => 8,
    'Ab' => 8,
    'A' => 9,
    'Bb' => 10,
    'A#' => 10,
    'B' => 11,
    'Cb' => 11
  }

  SIGNATURE = {
    'Fb'  => -8,
    'Cb'  => -7,
    'Gb'  => -6,
    'Db'  => -5,
    'Ab'  => -4,
    'Eb'  => -3,
    'Bb'  => -2,
    'F'   => -1,
    'C'   => 0,
    'G'   => 1,
    'D'   => 2,
    'A'   => 3,
    'E'   => 4,
    'B'   => 5,
    'F#'  => 6,
    'C#'  => 7,
    'G#'  => 8,
    'D#'  => 9,
    'A#'  => 10,
    'E#'  => 11,
    'B#'  => 12,
  }

  SHARPS = (0..6).map{|i| (6 + i*3) % 7}
  FLATS  = (0..6).map{|i| (3 + i*4) % 7}

  # Transpose any note by the same amount as a given root key to a new key.
  # It chooses notes that fit the key signature of the new root. For example:
  #
  #   transpose(from: 'C', to: 'G', note: 'B')
  #     => 'F#' (B was 7th note in C scale, F# is 7th note in G scale)
  #
  #   transpose(from: 'F', to: 'F#', note: 'D')
  #     => 'D#'
  #
  #   transpose(from: 'F', to: 'Gb', note: 'D')
  #     => 'Eb' # same note as above but in key signature of Gb
  #
  def transpose(from:, to:, note:)
    note_c = chromatic_index note
    from_c = chromatic_index from
    to_c = chromatic_index to
    diff_c = (to_c - from_c) % 12

    note_d = diatonic_index note
    from_d = diatonic_index from
    to_d = diatonic_index to
    diff_d = (to_d - from_d) % 7

    final_c = (note_c + diff_c) % 12
    final_d = (note_d + diff_d) % 7
    chromatic_at(final_c, diatonic_at(final_d)) || chromatic_at(final_c)
  end

  # 0 => C, 1 => C#, ..
  def chromatic_at(index, key=nil)
    CHROMATICS.detect{|k, v| v == index && (!key || k.start_with?(key))}.try(:[], 0)
  end

  # C => 0, C# => 1, ..
  def chromatic_index(note)
    CHROMATICS[note.match(/^[A-G][#b]?/).to_s]
  end

  # 0 => C, 1 => D, 2 => E, ..
  def diatonic_at(index)
    DIATONICS[index]
  end

  # C => 0, D => 1, E => 2, ..
  def diatonic_index(key)
    DIATONICS.index key[0]
  end

  def scale_of(key)
    minor = key.end_with?('m')
    key = key.sub(/m$/, '')

    signature = SIGNATURE[key]
    signature -= 3 if minor
    diatonics = DIATONICS.rotate(diatonic_index(key))

    sharps = SHARPS.slice(0, signature.abs)
    flats = FLATS.slice(0, signature.abs)

    if minor
      sharps = sharps.map{|flat| (flat + 2) % 7}
      flats = flats.map{|flat| (flat + 2) % 7}
    end

    if signature == 0
      diatonics

    elsif signature > 0
      diatonics.each_with_index.map{|note, index|
        sharps.include?(index) ? "#{note}#" : note
      }

    else
      diatonics.each_with_index.map{|note, index|
        flats.include?(index) ? "#{note}b" : note
      }

    end
  end

  def chords_of(key)
    scale = scale_of(key)
    if key.end_with?('m')
      ["#{scale[0]}m", scale[2], "#{scale[3]}m", "#{scale[4]}m", scale[5], scale[6]]
    else
      [scale[0], "#{scale[1]}m", "#{scale[2]}m", scale[3], scale[4], "#{scale[5]}m"]
    end
  end

end
