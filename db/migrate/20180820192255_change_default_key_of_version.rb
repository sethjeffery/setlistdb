class ChangeDefaultKeyOfVersion < ActiveRecord::Migration[5.2]
  def change
    SetlistVersion.where(key: '').update_all(key: 'G')
    change_column :versions, :key, :string, default: 'G'
  end
end
