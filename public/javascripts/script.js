window.onload = function() {
    var converter = new showdown.Converter({
        'strikethrough': true, 
        'tables': true, 
        'tasklists': true});
    var pad = document.getElementById('pad');
    var markdownArea = document.getElementById('markdown');

    var convertTextAreaToMarkdown = function() {
        var markdownText = pad.value;
        html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;

        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    };

    pad.addEventListener('input', convertTextAreaToMarkdown);

    convertTextAreaToMarkdown();

    $('#toolbar button').click(function() {
        convertTextAreaToMarkdown();
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    })

    $('#toolbar select').change(function() {
        convertTextAreaToMarkdown();
    })

};


String.prototype.insertAt = function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

function wrapIt(w) {
    pad.value = pad.value.insertAt(pad.selectionEnd, w).insertAt(pad.selectionStart, w);
    pad.focus();
}

function prefixIt(w) {
    pad.value = pad.value.insertAt(pad.selectionStart, w);
    pad.focus();
}

function wrapAround(l, r) {
    pad.value = pad.value.insertAt(pad.selectionEnd, r).insertAt(pad.selectionStart, l);
    pad.focus();
}


$('#v-bold').click(function() {
    let wrapper = "**";
    wrapIt(wrapper);
})

$('#v-italics').click(function() {
    let wrapper = "*";
    wrapIt(wrapper);
})

$('#v-strikeThrough').click(function() {
    let wrapper = "~~";
    wrapIt(wrapper);
})

$('#v-code').click(function() {
    let wrapper = "`";
    wrapIt(wrapper);
})

$('#v-image').click(function() {
    let imageUrl = prompt('Image Url');
    //![alt text](url "Logo Title Text 1")
    wrapAround(`![`, `](${imageUrl})`);
})

$('#v-link').click(function() {
    let linkUrl = prompt('Link Url');
    wrapAround(`[`, `](${linkUrl})`);
})

$('#v-coder').click(function() {
    let codeType = prompt('Code Type');
    wrapAround('```'+codeType+'\n', '\n```');
})

$('#v-unorderedList').click(function(){
    var textArea = pad.value;
    var selectPart = textArea.substring(pad.selectionStart, pad.selectionEnd);

    var tempSelectPart = '- '+selectPart;
    var finalSelectPart = tempSelectPart.replace(/\n/g, '\n- ');
    pad.value = pad.value.replace(selectPart, finalSelectPart);
    pad.focus();
})

$('#v-orderedList').click(function(){ 
    var textArea = pad.value;
    var selectPart = textArea.substring(pad.selectionStart, pad.selectionEnd);

    var arrayed = selectPart.split('\n');
    //var finalSelectPart = arrayed.map((x,i)=> `\n${i+1}. ${x}`);
    var finalSelectPart = '';

    for(var i=0; i<arrayed.length; i++){
        var item = i+1 + '. ' + arrayed[i] + '\n';
        finalSelectPart = finalSelectPart + item;    
    }

    pad.value = pad.value.replace(selectPart, finalSelectPart);
    pad.focus();
    
})

$('#v-tasklist').click(function(){
    var textArea = pad.value;
    var selectPart = textArea.substring(pad.selectionStart, pad.selectionEnd);

    var tempSelectPart = '- [ ] '+selectPart;
    var finalSelectPart = tempSelectPart.replace(/\n/g, '\n- [ ] ');
    pad.value = pad.value.replace(selectPart, finalSelectPart);  
    pad.focus();
})


$('#v-hr-link').click(function(){
    var line = '---\n';
    prefixIt(line);
})

$('#v-bq').click(function(){
    var bq = ' > ';
    prefixIt(bq);
})

$('#v-table').click(function(){
    var s = '\xa0\xa0\xa0\xa0\xa0';
    var defaultTable = `|${s}Table${s}|${s}Are${s}\xa0\xa0|\n|${s}-----${s}|${s}---${s}\xa0\xa0|`;
    prefixIt(defaultTable);
})

$('#v-row').click(function(){
    var s = '\xa0\xa0\xa0\xa0\xa0';
    var rowTable = `|${s}${s}${s}|${s}${s}${s}|\n`;
    prefixIt(rowTable);
})

$('#v-save').click(function(){
    var textToSave = document.getElementById("pad").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = $('#markdown h1:first-child').text().replace(/\s/g,'_')+'.md';
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
})

function destroyClickedElement(event){
    document.body.removeChild(event.target);
}

$('#v-undo').click(function(){
    document.execCommand('undo')
})

$('#v-redo').click(function(){
    document.execCommand('redo')
})
 


$('#headers').change(function() {
    console.log($(this).val());
    const headingType = $(this).val();
    let wrapper = "";
    for (var i = 0; i < headingType; i++) {
        wrapper = wrapper + "#";
    }
    prefixIt(wrapper);
})


$('#pad').on('scroll', function () {
    $('#markdown').scrollTop($(this).scrollTop());
});