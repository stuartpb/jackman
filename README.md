# What is Jackman?

Jackman is a blog engine for Express, inspired by Jekyll - 

## GROAN - let's just start the FAQ right here

**Q: Why? Were the thousands of other pet projects on Github stating that their
goal is to reinvent Jekyll in [Node/CoffeeScript/Python/Java/bash/machine code]
because their author doesn't like [Ruby/Liquid/Tom Preston-Werner] not 
enough? Why are you making yet another one of these? What kind of a monster
*are* you?**

A: The thing about every clone of Jekyll that I've seen is that all of them are
designed to reinvent the static *page generation* of Jekyll. Jackman, on the
other hand, takes the static *content model* of blog posts from Jekyll and, as
an Express app, generates only one thing: *responses*. 

If you want to process Jackman's blog constructions into static files, you can
design a static file construction layer around Express, like
`$ node server && wget -m http://localhost:3000`. However, if you want to host
your entire site in Node, with fine-tuned logging and dynamic apps, you can do
that without having to bother with the dynamic construction step.

## What this is, and what it wants to be

I'm writing this right now just so I can get my own personal blog off the
ground, so some things I'd rather have be dynamic and configurable (like
routing and layout, both internal and external) are going to be hardcoded to
start with. I'm not looking to make the design of it any more opinionated than
Jekyll (in fact, I want to make it ultimately flexible enough to be compatible
with Jekyll), I'm just blocking it out the way I want it to work personally.

## Name

Jackman is named after the protagonist of the 2007 BBC TV series *Jekyll*.
It's a pretty neat show. If you like Stephen Merchant's other stuff, you should
definitely give it a look.

## License In Three Lines (LITL)

Copyright 2013 Stuart P. Bentley.
This work may be used freely as long as this notice is included.
The work is provided "as is" without warranty, express or implied.