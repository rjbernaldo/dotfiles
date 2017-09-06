execute pathogen#infect()
syntax on
colorscheme monokai
filetype plugin indent on

set noswapfile
set tabstop=2
set shiftwidth=2
set expandtab
set mouse=a
set number
set guioptions=

let g:tmux_navigator_no_mappings = 1
let g:NERDTreeWinSize = 25
let g:ag_working_path_mode = "r"
let g:session_autosave = 'no'
let g:jsx_ext_required = 0
let g:syntastic_javascript_checkers = ['eslint']
let g:ctrlp_custom_ignore = {
  \ 'dir':  '\v[\/]\.(git|hg|svn|node_modules)$',
  \ 'file': '\v\.(exe|so|dll)$',
  \ }

nnoremap <silent> <C-h> <C-W>h
nnoremap <silent> <C-j> <C-W>j
nnoremap <silent> <C-k> <C-W>k
nnoremap <silent> <C-l> <C-W>l
nnoremap <silent> <C-\> <C-W>= \| :NERDTreeToggle \| <C-W>=<cr>
nnoremap <silent> <C-W>h 10<C-W><
nnoremap <silent> <C-W>j 10<C-W>-
nnoremap <silent> <C-W>k 10<C-W>+
nnoremap <silent> <C-W>l 10<C-W>>

