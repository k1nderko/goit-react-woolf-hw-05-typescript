import React, { createContext, useMemo, useState, useContext } from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";

type SelectedMenu = {
  id: MenuIds;
};

type Menu = {
  id: MenuIds;
  title: string;
};

type MenuAction = {
  onSelectedMenu: (selectedMenu: SelectedMenu) => void;
};

const MenuSelectedContext = createContext<{ selectedMenu: SelectedMenu }>({
  selectedMenu: { id: "" },
});

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

interface PropsProvider {
  children: React.ReactNode;
}

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({ id: "" });

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

interface PropsMenu {
  menus: Menu[];
}

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title} {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}