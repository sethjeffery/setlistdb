class SetlistVersion < ApplicationRecord
  include Hashid::Rails

  belongs_to :setlist
  belongs_to :version

  acts_as_list
  scope :ordered, -> { order(:position) }
end
