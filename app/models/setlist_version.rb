class SetlistVersion < ApplicationRecord
  belongs_to :setlist
  belongs_to :version
  acts_as_list
end
