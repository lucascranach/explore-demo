const fs = require('fs');

const checkImage = (imgSrc) => {
  // Check if image is in folder src/images
  
};

module.exports = relationGraph = (items, attr) => {

  const all = attr && attr.all ? true : false;
  const stack = items.slice(0, 5000);

  const itemsWithReferences = stack.filter(item => {
    const c = item.references.length > 0 && item.references.findIndex(ref => ref.kind === 'PART_OF_WORK') >= 0
    return c;
  });

  const itemsWithReferencesThatAreInStack = itemsWithReferences
    .filter(item => {

      const a = item.references.find(ref => {
        const b = ref.kind === 'PART_OF_WORK' && stack.findIndex(item => item.metadata.id === ref.inventoryNumber) > 0;
        return b;
      });

      if (a) {
        return true;
      }
      return false
    }
    );
  console.log(itemsWithReferencesThatAreInStack.length);
  const dempo = itemsWithReferencesThatAreInStack.map(item => {
    return item.references.map(ref => {

      // console.log(ref.kind);
    });
  });

  const nodeData = all ? stack : itemsWithReferencesThatAreInStack;
  const nodes = nodeData.map(item => {

    const imgSrc = checkImage(item.metadata.imgSrc);

    return {
      id: item.metadata.id,
      group: item.metadata.classification,
      img: item.metadata.imgSrc
    };
  });

  const links = itemsWithReferencesThatAreInStack.map(item => {
    return item.references.map(ref => {
      const target = nodes.find(item => item.id === ref.inventoryNumber && ref.kind === 'PART_OF_WORK') ? ref.inventoryNumber : null;
      if (!target) return;
      return {
        source: item.metadata.id,
        target: target
      };
    });
  }
  ).flat();

  const linksWithoutNull = links.filter(link => link);

  fs.writeFile('relations.json', JSON.stringify({ nodes: nodes, links: linksWithoutNull }), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  return {
    nodes: nodes,
    links: linksWithoutNull
  };
}