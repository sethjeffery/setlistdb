class AddSlugToSong < ActiveRecord::Migration[5.2]
  def change
    add_column :songs, :slug, :string
    add_index :songs, :slug
  end
end
