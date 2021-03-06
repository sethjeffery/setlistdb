class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :trackable, :omniauthable, omniauth_providers: %i[facebook google_oauth2]

  has_many :versions, dependent: :destroy
  has_many :setlists, dependent: :destroy
  attr_accessor :password

  extend FriendlyId
  friendly_id :name, use: :slugged

  validates_inclusion_of :role, within: %w[admin], allow_nil: true

  def to_s
    name.presence || email.split('@').first
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create! do |user|
      user.email = auth.info.email
      user.name = auth.info.name   # assuming the user model has a name
      user.image = auth.info.image # assuming the user model has an image
      user.password = Devise.friendly_token[0,20]
      # If you are using confirmable and the provider(s) you use validate emails,
      # uncomment the line below to skip the confirmation emails.
      # user.skip_confirmation!
    end
  end

  def admin?
    role == 'admin'
  end
end
