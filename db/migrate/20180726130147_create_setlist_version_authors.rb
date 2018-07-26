class CreateSetlistVersionAuthors < ActiveRecord::Migration[5.2]
  def change
    create_table :setlist_version_authors do |t|
      t.references :setlist_version, foreign_key: true
      t.references :author, foreign_key: true
      t.integer :authoring, default: 0
      t.integer :position, default: 1

      t.timestamps
    end
  end
end
