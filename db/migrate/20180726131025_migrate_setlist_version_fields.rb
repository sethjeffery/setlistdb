class MigrateSetlistVersionFields < ActiveRecord::Migration[5.2]
  def change
    SetlistVersion.all.each do |setlist_version|
      setlist_version.inherit_version_fields
      setlist_version.save!
    end
  end
end
