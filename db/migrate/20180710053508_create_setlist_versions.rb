class CreateSetlistVersions < ActiveRecord::Migration[5.2]
  def change
    create_table :setlist_versions do |t|
      t.references :setlist, foreign_key: true
      t.references :version, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
