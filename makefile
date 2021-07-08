ROOT=test
NEXT=./build/$(shell date +%s)
NTH=1
BUILD_LAST:=$(shell cat builds.txt | tail -n $(NTH) | head -n 1)

defualt: full

backup: .fake
	cp -r build ~/.pn2js-tmp

last: .fake
	rm -rf bootstrap
	mkdir -p bootstrap
	cp -r stage1 $(NEXT)
	$(MAKE) --no-print-directory full ROOT=$(BUILD_LAST)
	cp -r $(NEXT) bootstrap
	rm bootstrap/*/*.pn
	rm bootstrap/*/*/*.pn
	echo $(NEXT) >> builds.txt

full: test
	node $(ROOT)/index.js $(NEXT)/index.pn
	node $(ROOT)/index.js $(NEXT)/compiler/cjs.pn
	node $(ROOT)/index.js $(NEXT)/parser/keyword.pn
	node $(ROOT)/index.js $(NEXT)/parser/lex.pn
	node $(ROOT)/index.js $(NEXT)/parser/node.pn
	node $(ROOT)/index.js $(NEXT)/parser/op.pn
	node $(ROOT)/index.js $(NEXT)/parser/parse.pn
	node $(ROOT)/index.js $(NEXT)/parser/prec.pn
	node $(ROOT)/index.js $(NEXT)/parser/token.pn

test:
	mkdir test

.fake: