ROOT=./stage0
NEXT=./stage1

defualt: run

run: .fake
	@$(MAKE) --no-print-directory run0
	@$(MAKE) --no-print-directory run1
	@$(MAKE) --no-print-directory run2

run0: .fake
	node ./stage0 ./pn/test.pn
	node ./pn/test.js

stage1: .fake
	node $(ROOT)/index.js $(NEXT)/index.pn
	node $(ROOT)/index.js $(NEXT)/parser/keyword.pn
	node $(ROOT)/index.js $(NEXT)/parser/lex.pn
	node $(ROOT)/index.js $(NEXT)/parser/node.pn
	node $(ROOT)/index.js $(NEXT)/parser/prec.pn
	node $(ROOT)/index.js $(NEXT)/parser/token.pn

run1: stage1
	node ./stage1/index.js ./pn/test.pn
	node ./pn/test.js

stage2: .fake
	cp -r stage1 stage0
	@$(MAKE) --no-print-directory stage1 ROOT=./stage0 NEXT=./stage1
	@$(MAKE) --no-print-directory stage1 ROOT=./stage1 NEXT=./stage2

run2: stage2
	node ./stage2/index.js ./pn/test.pn
	node ./pn/test.js

.fake: