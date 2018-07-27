Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    sessions: 'users/sessions',
  }

  devise_scope :user do
    delete "/logout" => "users/sessions#destroy", as: :logout
  end

  root to: "home#index"

  resources :songs do
    post :import, on: :collection
    resources :versions, path: 'v' do
      get :chordpro
      get :onsong
      get :pdf
    end
  end

  resources :users

  resources :setlists do
    member do
      post 'add/:song_id/:version_id', action: :add, as: :add
      post 'reorder', as: :reorder
    end
    resources :setlist_versions, path: 'versions'
  end

  get 'search', to: 'search#index'
  get 'terms', to: 'terms#index'
  get 'privacy', to: 'terms#privacy'
end
