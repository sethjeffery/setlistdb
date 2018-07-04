class AddUnaccentExtension < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      CREATE extension IF NOT EXISTS unaccent;
    SQL
  end
end
