class AddVersionFieldsToSetlistVersion < ActiveRecord::Migration[5.2]
  def change
    add_column :setlist_versions, :title, :string
    add_column :setlist_versions, :content, :text
    add_column :setlist_versions, :key, :string
    add_column :setlist_versions, :transpose, :integer, default: 0
    add_column :setlist_versions, :year, :integer
    add_column :setlist_versions, :lang, :string
  end
end
