%%program%% %%version%% - %%description%%

Generates rivotter-compatible file objects as lines of JSON to stdout.

usage:

    %%program%% [options] type exts fileSpec fileSpec ...

parameters:

    type            one of the Prism supported languages
    exts            comma-separated list of file extensions to match
    fileSpec        file, directory, or glob to search for files

options:

    -t --types        print the valid Prism languages
    -h --help         print this help
    -v --version      print the program version

Debug logging is enabled by setting the environment variable `LOGLEVEL` to
`debug`.

Prism supported languages: http://prismjs.com/#languages-list

For more information, visit %%homepage%%
