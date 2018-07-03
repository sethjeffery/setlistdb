class Author < ApplicationRecord
  has_many :versions, dependent: :nullify
  has_many :songs, dependent: :nullify

  def to_s
    name
  end
end
