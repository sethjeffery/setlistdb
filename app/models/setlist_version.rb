class SetlistVersion < ApplicationRecord
  belongs_to :setlist
  belongs_to :version
  acts_as_list

  def to_param
    position.to_s
  end
end
