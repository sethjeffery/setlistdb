class AddNotesToSetlistVersions < ActiveRecord::Migration[5.2]
  def change
    add_column :setlist_versions, :notes, :text
  end
end
