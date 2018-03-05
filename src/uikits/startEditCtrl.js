class startEditCtrl {
  pan = () => {
    const factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    const startupToolControl = factory.startupToolControl(map, 'PanTool');

    startupToolControl.run();
  };
  select = (geoLiveType, mode) => {
    const factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    const selectControl = factory.selectControl(map, geoLiveType, {
      selectMode: mode ? mode : 'point'
    });

    selectControl.run();
  };
  batchSelect = geoLiveType => {
    const factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    const createTipsControl = factory.copyLineControl(map, geoLiveType);

    createTipsControl.run();
  }

}
export default new startEditCtrl();
