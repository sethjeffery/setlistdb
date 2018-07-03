class CreateVersions < ActiveRecord::Migration[5.2]
  def change
    create_table :versions do |t|
      t.references :song, foreign_key: true, index: false
      t.string :title
      t.text :content
      t.text :lyrics
      t.references :author, foreign_key: true
      t.references :user, foreign_key: true
      t.string :key
      t.integer :year
      t.string :lang
      t.integer :version_type
      t.integer :position, default: 0

      t.timestamps
    end
    add_index :versions, :title
    add_index :versions, :lang
    add_index :versions, [:song_id, :position]
  end
end
