class Author < ApplicationRecord
  has_many :version_authors, dependent: :destroy
  has_many :versions, through: :version_authors
  has_many :setlist_version_authors, dependent: :destroy
  has_many :setlist_versions, through: :version_authors

  def to_s
    name
  end
end
