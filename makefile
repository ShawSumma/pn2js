ROOT=./stage0
NEXT=./stage1

defualt: stage1

clean1: .fake
	rm $(NEXT)/index.js
	rm $(NEXT)/compiler/cjs.js
	rm $(NEXT)/parser/keyword.js
	rm $(NEXT)/parser/lex.js
	rm $(NEXT)/parser/node.js
	rm $(NEXT)/parser/op.js
	rm $(NEXT)/parser/parse.js
	rm $(NEXT)/parser/prec.js
	rm $(NEXT)/parser/token.js

stage1: .fake
	node $(ROOT)/index.js $(NEXT)/index.pn
	node $(ROOT)/index.js $(NEXT)/compiler/cjs.pn
	node $(ROOT)/index.js $(NEXT)/parser/keyword.pn
	node $(ROOT)/index.js $(NEXT)/parser/lex.pn
	node $(ROOT)/index.js $(NEXT)/parser/node.pn
	node $(ROOT)/index.js $(NEXT)/parser/op.pn
	node $(ROOT)/index.js $(NEXT)/parser/parse.pn
	node $(ROOT)/index.js $(NEXT)/parser/prec.pn
	node $(ROOT)/index.js $(NEXT)/parser/token.pn

.fake: