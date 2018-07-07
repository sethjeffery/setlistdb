require 'test_helper'
require 'transposer'

class TransposerTest < ActiveSupport::TestCase
  include Transposer

  test 'scale_of' do
    assert_equal %w[C D E F G A B], scale_of('C')
    assert_equal %w[A B C# D E F# G#], scale_of('A')
    assert_equal %w[C D Eb F G Ab Bb], scale_of('Cm')
    assert_equal %w[F# G# A B C# D E], scale_of('F#m')
  end

  test 'transpose' do
    assert_equal 'F#', transpose(from: 'C', to: 'G', note: 'B')
    assert_equal 'D#', transpose(from: 'F', to: 'F#', note: 'D')
    assert_equal 'Eb', transpose(from: 'F', to: 'Gb', note: 'D')
    assert_equal 'D', transpose(from: 'Bb', to: 'D', note: 'A#')
  end

  test 'chords_of' do
    assert_equal %w[C Dm Em F G Am], chords_of('C')
    assert_equal %w[B C#m D#m E F# G#m], chords_of('B')
    assert_equal %w[Fm Ab Bbm Cm Db Eb], chords_of('Fm')
    assert_equal %w[Em G Am Bm C D], chords_of('Em')
  end
end
