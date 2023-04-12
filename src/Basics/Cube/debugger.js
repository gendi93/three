export const debugBuilder = (gui, options) => {
  const { folderName, target, controls } = options;
  gui.addFolder(folderName);
  const targetFolder = gui.folders.find(folder => folder._title === folderName);
  Object.keys(controls).forEach(control => {
    if (Object.keys(controls[control]).length) {
      Object.keys(controls[control]).forEach(axis => {
        const { label = `${control}${axis.toUpperCase()}`, min = -5, max = 5, step = 0.01 } = controls[control][axis];
        targetFolder
          .add(target[control], axis)
          .min(min)
          .max(max)
          .step(step)
          .name(label);
      });
    } else {
      targetFolder.add(target, control);
    }
  });
};
