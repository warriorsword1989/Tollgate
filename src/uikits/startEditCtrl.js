class startEditCtrl {
  pan = () => {
    const factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    const startupToolControl = factory.startupToolControl(map, 'PanTool');

    if (!startupToolControl) {
      swal('提示', '编辑流程未实现', 'info');
      return;
    }

    startupToolControl.run();
  };
  select = (geoLiveType, mode) => {
    const factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    const selectControl = factory.selectControl(map, geoLiveType, {
      selectMode: mode ? mode : 'point'
    });

    if (!selectControl) {
      swal('提示', '编辑流程未实现', 'info');
      return;
    }

    selectControl.run();
  };
  batchSelect = geoLiveType => {
    const factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    const createTipsControl = factory.copyLineControl(map, geoLiveType);
    if (!createTipsControl) {
      swal('提示', '编辑流程未实现', 'info');
      return;
    }

    createTipsControl.run();
  }

}
export default new startEditCtrl();
