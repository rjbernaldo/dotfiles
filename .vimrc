execute pathogen#infect()
syntax on
colorscheme monokai
filetype plugin indent on
set noswapfile
let g:NERDTreeWinSize=25
let g:ag_working_path_mode="r"
let g:session_autosave = 'no'
set tabstop=2
set shiftwidth=2
set expandtab
set mouse=a
set number
command NT :NERDTreeToggle
command NF :NERDTreeFocus
set guioptions=
let g:jsx_ext_required = 0
let g:syntastic_javascript_checkers = ['eslint']
