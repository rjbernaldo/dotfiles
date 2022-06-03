execute pathogen#infect()

set ttyfast
set re=1 
syntax enable
"filetype plugin indent on
"set list lcs=tab:\|\ (here is a space)
set list lcs=tab:\▏\ 

set t_Co=256
if (has("termguicolors"))
  set termguicolors
endif

set guifont="Fira Code iScript"

let g:oceanic_next_terminal_bold = 1
let g:oceanic_next_terminal_italic = 1

" colorscheme OceanicNext
" let g:airline_theme='oceanicnext'
let ayucolor="dark"
colorscheme ayu
let g:airline_theme="ayu"

"colorscheme happy_hacking
"let g:airline_theme='wombat'

" FIX AUTOCOMPLETE
"set completeopt=longest,menuone
set completeopt=menu,menuone,preview,noselect,noinsert

" indent guides
let g:indentLine_setColors = 1
let g:indentLine_color_term = 239
let g:indentLine_char = '▏'
let g:indentLine_conceallevel = 2

" hide trailing tilde
" highlight EndOfBuffer ctermfg=235 ctermbg=235 guifg=235
" hi! EndOfBuffer ctermbg=bg ctermfg=bg guibg=bg guifg=bg
hi! SpecialKey guifg=#4f4f4f

set expandtab
set tabstop=2
set shiftwidth=2

set noswapfile
set mouse=a
set number
set bs=2

let g:tmux_navigator_no_mappings = 1
let g:tmuxline_preset = 'nightly_fox'
let g:tmuxline_powerline_separators = 0
let g:airline#extensions#tmuxline#enabled = 1
let airline#extensions#tmuxline#snapshot_file = "~/.tmux-status.conf"
let g:session_autosave = 'no'

let g:ale_completion_enabled = 1
"let g:ale_fixers = {
"      \  'javascript': ['eslint'],
"      \}
"let g:ale_fix_on_save = 1

let g:javascript_plugin_jsdoc = 1

" NERDTREE
"let g:nerdtree_tabs_open_on_console_startup=1
" let NERDTreeMapOpenSplit = 's'
" let NERDTreeMapOpenVSplit = 'v'
" let g:NERDTreeWinSize = 25
" let NERDTreeMinimalUI = 1
" let NERDTreeDirArrows=0
" let g:nerdtree_tabs_focus_on_files=1
" autocmd StdinReadPre * let s:std_in=1
" autocmd VimEnter * call timer_start(0, { tid -> execute('wincmd p')})
" autocmd VimEnter * NERDTree
" autocmd BufWinEnter * NERDTreeMirror

function! IsNERDTreeOpen()        
  return exists("t:NERDTreeBufName") && (bufwinnr(t:NERDTreeBufName) != -1)
endfunction

autocmd WinEnter * call s:CloseIfOnlyNerdTreeLeft()
function! s:CloseIfOnlyNerdTreeLeft()
  if exists("t:NERDTreeBufName")
    if bufwinnr(t:NERDTreeBufName) != -1
      if winnr("$") == 1
        q
      endif
    endif
  endif
endfunction

autocmd VimEnter * call SyncTree()
autocmd BufEnter * call SyncTree()
autocmd TabEnter * call SyncTree() | wincmd l
function! SyncTree()
  if &modifiable && IsNERDTreeOpen() && strlen(expand('%')) > 0 && !&diff
    NERDTreeFind
    wincmd p
  endif
endfunction

nnoremap <silent> <C-\> :NERDTreeToggle<cr>

" WHEN STARTING ON EMPTY DIRECTORY
if bufname('%') == ''
  set bufhidden=wipe
endif

" fzf + ripgrep
" http://owen.cymru/fzf-ripgrep-navigate-with-bash-faster-than-ever-before/
set rtp+=/usr/local/opt/fzf
let g:rg_command = '
  \ rg --column --line-number --no-heading --fixed-strings --ignore-case --no-ignore --hidden --follow --color "always"
  \ -g "*.{js,json,php,md,styl,jade,html,config,py,cpp,c,go,hs,rb,conf}"
  \ -g "!package-lock.json"
  \ -g "!{.git,node_modules,vendor}/*" '
command! -bang -nargs=* F call fzf#vim#grep(g:rg_command .shellescape(<q-args>), 1, <bang>0)
nnoremap <silent> <C-F> :F<Cr>
nnoremap <silent> <C-p> :Files<Cr>
let g:fzf_action = {
  \ 'ctrl-t': 'tab split',
  \ 'ctrl-s': 'split',
  \ 'ctrl-v': 'vsplit' }

" tmux integration
nnoremap <silent> <C-h> :TmuxNavigateLeft<cr>
nnoremap <silent> <C-j> :TmuxNavigateDown<cr>
nnoremap <silent> <C-k> :TmuxNavigateUp<cr>
nnoremap <silent> <C-l> :TmuxNavigateRight<cr>
"nnoremap <silent> <C-e> :NERDTreeTabsToggle<cr>

" CODE FOLDING
set foldmethod=indent
set foldnestmax=10
set nofoldenable
set foldlevel=10

" GO
let g:go_doc_keywordprg_enabled = 0
let g:go_list_height = 0
let g:go_fmt_fail_silently = 1

" https://vim.fandom.com/wiki/Mac_OS_X_clipboard_sharing
set clipboard=unnamed


